module.exports = (app) => {
  app.route('/users')
    .get((req, res, next) => {
      const users = []

      for (let i = 1; i <= 10; i++) {
        users.push({
          id: i,
          username: `user${i}`
        })
      }

      return res.status(200).json(users)
    })
}
