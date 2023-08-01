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
      Properties : {
        Stage: '$default',
        DomainName : domain,
        ApiId: { Ref: 'HTTP' }
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
            ForwardedValues: {
              QueryString: true,
              Cookies: { Forward: 'all' },
            },
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
            ForwardedValues: {
              QueryString: true,
              Cookies: { Forward: 'all' },
            },
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
