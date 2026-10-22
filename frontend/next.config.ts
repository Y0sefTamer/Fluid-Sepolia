import type { NextConfig } from 'next'

// RainbowKit statically imports the Base Account connector, whose optional x402
// modules are not installed. This app never uses that payment path, so alias the
// missing modules to empty modules for the webpack build.
const optionalX402Modules = [
  '@x402/core/client',
  '@x402/evm',
  '@x402/evm/exact/client',
  '@x402/evm/upto/client',
  '@x402/svm/exact/client',
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(
        optionalX402Modules.map((moduleName) => [moduleName, false]),
      ),
    }
    return config
  },
}

export default nextConfig
