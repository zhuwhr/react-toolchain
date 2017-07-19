import Router from 'express';
import User from '../data/models'
const router = new Router();

router.route('/users/:id')
  .get()
  .put()
  .delete();

router.route('/users')
  .get((req, res) => {
    User.findAll().then((err, users) => {
      if (err) {
        res.send(err);
      }
      res.json(users)
    })
  })
  .post();

export default router;
