import { RequestHandler, Request } from 'express';
import { config } from '~/config';
import { promises as fs } from 'fs';
import { pick } from "lodash";

import { Org } from "~/types/org";
import { User } from "~/types/user";

const readDB = async (): Promise<any> => {
  try {
    const data = await fs.readFile(config.DB_PATH, 'utf8');
    return JSON.parse(data) || {};
  }
  catch(err) {
    throw err;
  }
};

const writeDB = async (db: any) => {
  try {
    await fs.writeFile(config.DB_PATH, JSON.stringify(db, null, 2)); 
  }
  catch(err) {
    throw err;
  }
}

const paginate = (elements: any[], req: Request): any => {
  const page: number | null = req?.query?.page ? parseInt(req.query.page as string) : 1;
  let per_page: number | null = req?.query?.per_page ? parseInt(req.query.per_page as string) : 10;
  if (per_page >= 50) {
    per_page = 50;
  }

  const offset = (page - 1) * per_page;
  const paginatedElements = elements.slice(offset).slice(0, per_page);
  const totalPages = Math.ceil(elements.length / per_page);

  return {
    meta: {
      count: elements.length,
      page,
      total_pages: totalPages,
      per_page,
      ...(page > 1 ? { prev_page: page - 1 } : {}),
      ...(page < totalPages ? { next_page: page + 1 } : {}),
    },
    data: paginatedElements
  };
}

export const getOrgs: RequestHandler = async (req, res, next) => {
  const db = await readDB();
  const orgs: Org[] = db.orgs || [];
  const formattedOrgs: any[] = orgs?.map((o: Org) => ({ id: o.id, name: o.name }));
  return res.send(paginate(formattedOrgs, req));
}

export const getOrgsById: RequestHandler = async (req, res, next) => {
  const { orgId } = req.params;
  const db = await readDB();
  const orgs: Org[] = db.orgs || [];
  const org: Org | undefined = orgs.find((o: Org) => o.id === orgId);

  if (!org) {
    return res.sendStatus(404);
  }

  const formattedOrg = { id: org?.id, name: org?.name };
  return res.send({ data: formattedOrg });
}

export const getUsersByOrgId: RequestHandler = async (req, res, next) => {
  const { orgId } = req.params;
  const db = await readDB();
  const orgs: Org[] = db.orgs || [];
  const org: Org | undefined = orgs.find((o: Org) => o.id === orgId);
  
  if (!org) {
    return res.sendStatus(404);
  }

  const users = org?.users || [];
  return res.send(paginate(users, req));
}

export const getLabelsByOrgId: RequestHandler = async (req, res, next) => {
  const { orgId } = req.params;
  const db = await readDB();
  const orgs: Org[] = db.orgs || [];
  const org: Org | undefined = orgs.find((o: Org) => o.id === orgId);
  
  if (!org) {
    return res.sendStatus(404);
  }

  const labels: string[] = org?.labels || [];
  return res.send({ data: labels });
}

export const createLabelByOrgId: RequestHandler =  async (req, res, next) => {
  const { label } = req.body;
  
  if (!label) {
    return res.sendStatus(400);
  }

  const { orgId } = req.params;
  const db = await readDB();
  const orgs: Org[] = db.orgs || [];
  const org: Org | undefined = orgs.find((o: Org) => o.id === orgId);
  const orgIdx: number = orgs.findIndex((o: Org) => o.id === orgId);

  if (!org) {
    return res.sendStatus(404);
  }

  db.orgs[orgIdx].labels.push(label);

  writeDB(db)
    .then((data) => {
      console.log(data)
      return res.send({ 
        meta: {
          saved: db.orgs[orgIdx]
        }, 
      });
    })
    .catch(() => {
      return res.sendStatus(500);
    })
}

export const updateUserByOrgAndUserId: RequestHandler = async (req, res, next) => {
  const { orgId, uid } = req.params;
  const mask = (req.query?.mask as string || '').split(',');
  const body = pick(req.body, mask);

  const db = await readDB();
  const orgs: Org[] = db.orgs || [];
  const org: Org | undefined = orgs.find((o: Org) => o.id === orgId);
  const orgIdx: number = orgs.findIndex((o: Org) => o.id === orgId);
  const user: User | undefined = (org?.users || []).find((u: User) => u.id === uid);
  const userIdx: number = (org?.users || []).findIndex((u: User) => u.id === uid);

  if (!org || !user) {
    return res.sendStatus(404);
  }

  db.orgs[orgIdx].users[userIdx] = { ...user as User, ...body }

  writeDB(db)
    .then(() => {
      return res.send({ 
        meta: {
          saved: db.orgs[orgIdx].users[userIdx]
        }, 
      });
    })
    .catch(() => {
      return res.sendStatus(500);
    })
}

export const deleteUserByOrgAndUserId: RequestHandler = async (req, res, next) => {
  const { orgId, uid } = req.params;

  const db = await readDB();
  const orgs: Org[] = db.orgs || [];
  const org: Org | undefined = orgs.find((o: Org) => o.id === orgId);
  const orgIdx: number = orgs.findIndex((o: Org) => o.id === orgId);
  const user: User | undefined = (org?.users || []).find((u: User) => u.id === uid);
  const userIdx: number = (org?.users || []).findIndex((u: User) => u.id === uid);

  if (!org || !user) {
    return res.sendStatus(404);
  }

  db.orgs[orgIdx].users.splice(userIdx, 1);

  writeDB(db)
    .then(() => {
      return res.send({ 
        meta: {
          deleted: uid
        }, 
      });
    })
    .catch(() => {
      return res.sendStatus(500);
    })
}