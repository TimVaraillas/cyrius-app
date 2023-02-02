const express = require('express');

const OrgsRouter = express.Router({ mergeParams: true });

OrgsRouter.get('/orgs', (req: any, res: any) => {
  res.send('Coucou');
});

export { OrgsRouter };