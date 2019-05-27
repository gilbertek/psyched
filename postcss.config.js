module.exports = ctx => ({
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: {
    autoprefixer: {
      flexbox: 'no-2009'
    }
  }
});
