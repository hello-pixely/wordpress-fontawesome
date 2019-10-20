import React from 'react'
import ClientPreferencesView from './ClientPreferencesView'
import UnregisteredClientsView from './UnregisteredClientsView'
import PluginVersionWarningsView from './PluginVersionWarningsView'
import V3DeprecationWarning from './V3DeprecationWarning'
import ReleaseProviderWarning from './ReleaseProviderWarning'
import { get, values, size } from 'lodash'
import { useSelector } from 'react-redux'

export default function TroubleshootTab() {
  const hasV3DeprecationWarning = useSelector(state => !!state.v3DeprecationWarning)
  const unregisteredClients = useSelector(state => state.unregisteredClients)
  const pluginVersionWarnings = useSelector(state => values( state.pluginVersionWarnings ))
  const pluginVersion = useSelector(state => state.pluginVersion)
  const releaseProviderStatus = useSelector(state => state.releaseProviderStatus)
  const releaseProviderStatusOK = useSelector(state => {
    // If releaseProviderStatus is null, it means that a network request was never issued.
    // We take that to mean that it's using a cached set of release metadata, which is OK.
    const status = releaseProviderStatus || null
    const code = get(status, 'code', 0)

    // If the status is not null, then the (HTTP) code for that network request should be in the OK range.
    return status === null || (code >= 200 && code <= 300)
  })

  return <div>
    { hasV3DeprecationWarning && <V3DeprecationWarning /> }
    { releaseProviderStatusOK || <ReleaseProviderWarning /> }
    <ClientPreferencesView />
    <UnregisteredClientsView clients={ unregisteredClients }/>
    {
      size(pluginVersionWarnings) > 0
      ? <PluginVersionWarningsView warnings={ pluginVersionWarnings } pluginVersion={ pluginVersion }/>
      : null
    }
  </div>
}