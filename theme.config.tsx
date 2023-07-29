import { useRouter } from 'next/router'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <strong>AssureX</strong>,
  project: {
    link: 'https://github.com/yiyun-sj/assurex',
  },
  darkMode: true,
  docsRepositoryBase: 'https://github.com/yiyun-sj/assurex',
  footer: {
    text: 'AssureX Docs',
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s - AssureX Docs',
      }
    }
  },
}

export default config