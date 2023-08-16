import { useRouter } from 'next/router'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'

const LogoSVG = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    className='text-gray-100'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect width='100%' height='100%' rx='16' fill='white' />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z'
      fill='black'
    />
  </svg>
)

const config: DocsThemeConfig = {
  logo: (
    <>
      <LogoSVG />
      <strong>AssureX</strong>
    </>
  ),
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
  head: function useHead() {
    const { title } = useConfig()
    return (
      <>
        <meta name='msapplication-TileColor' content='#fff' />
        <meta name='theme-color' content='#fff' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta httpEquiv='Content-Language' content='en' />
        <meta name='description' content='Make purchasing easy with AssureX.' />
        <meta
          name='og:description'
          content='Make purchasing easy with AssureX.'
        />
        <meta
          name='og:title'
          content={title ? title + ' - AssureX' : 'AssureX'}
        />
        <meta name='apple-mobile-web-app-title' content='AssureX' />
        <link rel='icon' href='/favicon.ico?=v2' />
        <link rel='apple-touch-icon' href='/logo192.png' />
        <link rel='manifest' href='/manifest.json' />
      </>
    )
  },
}

export default config
