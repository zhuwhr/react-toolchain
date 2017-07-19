import { router } from 'express';
const routers = router();

router.route('/users/:id')
  .get()
  .put()
  .delete();

router.route('/users')
  .get()
  .post();

export default routers;
