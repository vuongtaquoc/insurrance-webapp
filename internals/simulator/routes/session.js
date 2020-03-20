module.exports = (app) => {
  app.route('/sessions')
    .post((req, res, next) => {
      return res.status(200).json({
        id: 1,
        username: 'user1',
        accessToken: 'xxx'
      })
    })
}
