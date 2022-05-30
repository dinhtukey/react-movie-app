const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: 'aa6e11e18500b847f2e56fd914d216c0',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;