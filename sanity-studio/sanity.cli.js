import { defineCliConfig } from 'sanity/cli'
import clientConfig from './sanity.config'

export default defineCliConfig({
  api: clientConfig,
})