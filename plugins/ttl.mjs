export let deploy = {

  start ({ arc, cloudformation, stage }) {

    cloudformation.Resources.DataTable.Properties.TimeToLiveSpecification.AttributeName = 'ttl' 
    return cloudformation
  }
}

