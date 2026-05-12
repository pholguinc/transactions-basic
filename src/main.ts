export const getServerPort = () => {
  return process.env.PORT || 3000
}

if (require.main === module) {
  console.log(`🚀 Server running at http://localhost:${getServerPort()}`)
}
