export let deploy = { 
  start ({ arc, cloudformation, dryRun, inventory, stage }) {

    // pull config from app.arc @dns pramga
    let domain = arc.dns[0][1]
    let zone = arc.dns[1][1]

    // create a cert
    cloudformation.Resources.Certificate = {
      Type: 'AWS::CertificateManager::Certificate',
      Properties: {
        ValidationMethod: 'DNS', // required!
        DomainName: domain,
        SubjectAlternativeNames: [ `*.${domain}` ],
        DomainValidationOptions: [ {
          DomainName: domain,
          HostedZoneId: zone,
        } ]
      }
    }

    // create an apig domain
    cloudformation.Resources.Domain = {
      Type : "AWS::ApiGatewayV2::DomainName",
      Properties : {
        DomainName : domain,
        DomainNameConfigurations: [{
          CertificateArn: { Ref: 'Certificate' }
        }]
      }
    }

    // create apig mapping
    cloudformation.Resources.Mapping = {
      Type : "AWS::ApiGatewayV2::ApiMapping",
      DependsOn: 'HTTP',
      Properties : {
        Stage: '$default',
        DomainName : domain,
        ApiId: { Ref: 'HTTP' }
      }
    }

    // create origin request policy
    cloudformation.Resources.OriginRequestPolicy = {
      Type: "AWS::CloudFront::OriginRequestPolicy",
      Properties: {
        OriginRequestPolicyConfig: {
          Name: domain.replace('.', '-') + '-origin-request-policy',
          CookiesConfig: { CookieBehavior: 'all' },
          HeadersConfig: { HeaderBehavior: 'allViewer' },
          QueryStringsConfig: { QueryStringBehavior: 'all' }
        }
      }
    }

    // create a cache policy for our cloudfront distribution
    cloudformation.Resources.CachePolicy = {
      Type: "AWS::CloudFront::CachePolicy",
      Properties: {
        CachePolicyConfig: {
          Name: domain.replace('.', '-') + '-cache-policy',
          DefaultTTL: 86400,
          MaxTTL: 31536000,
          MinTTL: 0,
          ParametersInCacheKeyAndForwardedToOrigin: {
            EnableAcceptEncodingGzip: true,
            EnableAcceptEncodingBrotli: true,
            HeadersConfig: {
              HeaderBehavior: 'whitelist',
              Headers:  [ 
                'Authorization', 
                'Sec-WebSocket-Key',
                'Sec-WebSocket-Version',
                'Sec-WebSocket-Protocol',
                'Sec-WebSocket-Accept',
                'Sec-WebSocket-Extensions' 
              ] 
            },
            CookiesConfig: { CookieBehavior: 'none' },
            QueryStringsConfig: { QueryStringBehavior: 'none' },
          }
        }
      }
    }

    cloudformation.Resources.RequestFunction = {
      Type: 'AWS::CloudFront::Function',
      Properties: {
        Name: domain.replace('.', '-') + '-request-function',
        AutoPublish: true,
        FunctionCode: `
          function handler (event) {
            var request = event.request
            var uri = request.uri.replace('/_wss', '');
            if (uri[uri.length - 1] === '/') {
              uri = uri.substr(0, uri.length - 1)
            }
            request.uri = uri
            return request;
          }
        `,
        FunctionConfig: {
          Comment: 'function to remove trailing _wss from the request uri',
          Runtime: 'cloudfront-js-1.0'
        },
      }
    }

    // create cloudfront distribution
    cloudformation.Resources.CDN = {
      Type: 'AWS::CloudFront::Distribution',
      Properties: {
        DistributionConfig: {
          Aliases: [ domain ], // Important!
          HttpVersion: 'http2',
          IPV6Enabled: true,
          Enabled: true,
          Origins: [{
            Id: 'HttpEdgeOrigin',
            DomainName: {
              'Fn::Sub': [
                '${ApiId}.execute-api.${AWS::Region}.amazonaws.com',
                { ApiId: { Ref: 'HTTP' } }
              ]
            },
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginKeepaliveTimeout: 5, // NOTE FOR RYAN: up this for API edge config
              OriginProtocolPolicy: 'https-only', // thas right
              OriginReadTimeout: 30,
              OriginSSLProtocols: [ 'TLSv1', 'TLSv1.1', 'TLSv1.2' ],
            }
          }, {
            Id: 'WssEdgeOrigin',
            DomainName: {
              "Fn::Sub": [
                "${WS}.execute-api.${AWS::Region}.amazonaws.com",
              {}]
            },
            OriginPath: '/' + stage,
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginKeepaliveTimeout: 5, // NOTE FOR RYAN: up this for API edge config
              OriginProtocolPolicy: 'https-only', // thas right
              OriginReadTimeout: 30,
              OriginSSLProtocols: [ 'TLSv1', 'TLSv1.1', 'TLSv1.2' ],
            }
          }],
          DefaultCacheBehavior: {
            TargetOriginId: 'HttpEdgeOrigin',
            OriginRequestPolicyId: { Ref: 'OriginRequestPolicy' },
            CachePolicyId: { Ref: 'CachePolicy' },
            ViewerProtocolPolicy: 'redirect-to-https',
            MinTTL: 0,
            AllowedMethods: [ 'HEAD', 'DELETE', 'POST', 'GET', 'OPTIONS', 'PUT', 'PATCH' ],
            CachedMethods: [ 'GET', 'HEAD' ],
            SmoothStreaming: false,
            DefaultTTL: 86400,
            MaxTTL: 31536000,
            Compress: true, // Important!
          },
          CacheBehaviors: [{
            TargetOriginId: 'WssEdgeOrigin',
            PathPattern: '/_wss/*',
            // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html#managed-origin-request-policy-all-viewer-except-host-header
            OriginRequestPolicyId: 'b689b0a8-53d0-40ab-baf2-68738e2966ac', 
            // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-caching-disabled
            CachePolicyId: { Ref: 'CachePolicy' },//'4135ea2d-6df8-44a3-9df3-4b5a84be39ad',

            FunctionAssociations: [{
              EventType: 'viewer-request',
              FunctionARN: {'Fn::GetAtt': ['RequestFunction', 'FunctionMetadata.FunctionARN']}
            }],
            ViewerProtocolPolicy: 'allow-all',
            MinTTL: 0,
            AllowedMethods: [ 'HEAD', 'DELETE', 'POST', 'GET', 'OPTIONS', 'PUT', 'PATCH' ],
            CachedMethods: [ 'GET', 'HEAD' ],
            SmoothStreaming: false,
            DefaultTTL: 86400,
            MaxTTL: 31536000,
            Compress: true, // Important!
          }],
          PriceClass: 'PriceClass_All',
          ViewerCertificate: {
            AcmCertificateArn: {
              Ref: 'Certificate'
            },
            SslSupportMethod: 'sni-only',
            MinimumProtocolVersion: 'TLSv1.2_2019',
          }
        }
      }
    }

    // create alias
    cloudformation.Resources.Alias = {
      Type: 'AWS::Route53::RecordSetGroup',
      Properties: {
        HostedZoneName: `${domain}.`,
        RecordSets: [ {
          Name: `${domain}.`,
          Type: 'A',
          AliasTarget: {
            HostedZoneId: 'Z2FDTNDATAQYW2', // yes this is hardcoded
            DNSName: {
              'Fn::GetAtt': [ 'CDN', 'DomainName' ]
            }
          }
        } ]
      }
    } 

    return cloudformation
  }
}
