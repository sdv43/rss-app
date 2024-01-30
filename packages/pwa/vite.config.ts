import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  const generateIcons = () => {
    const iconFiles = [
      '/icons/app-icon144.png',
      '/icons/app-icon144.svg',
      '/icons/app-icon512.png',
      '/icons/app-icon512.svg',
    ]

    const purposes = ['any', 'maskable']

    const result: any[] = []

    for (const iconFile of iconFiles) {
      const src = iconFile.replace(/(\d+)\./, isProduction ? '$1.' : '$1-dev.')
      const ext = iconFile.match(/\.([a-z]+)$/)[1]
      const size = iconFile.match(/(\d+)\./)[1]

      const icon = {
        src,
        sizes: `${size}x${size}`,
        type: `image/${ext}`,
      }

      for (const purpose of purposes) {
        result.push({
          ...icon,
          purpose,
        })
      }
    }

    return result
  }

  return {
    plugins: [
      preact(),
      VitePWA({
        registerType: null,
        manifest: {
          theme_color: '#fcfcfd',
          background_color: '#fcfcfd',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          name: isProduction ? 'RSS Reader' : 'RSS Reader Dev',
          short_name: isProduction ? 'RSS' : 'RSS Dev',
          icons: generateIcons(),
        },
      }),
    ],
  }
})
