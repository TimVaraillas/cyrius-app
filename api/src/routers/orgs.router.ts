import { Router } from "express";
import * as controller from "~/controllers/orgs.controller";

const router = Router({ mergeParams: true });

router.get("/orgs", controller.getOrgs);
router.get("/orgs/:orgId", controller.getOrgsById);
router.get("/orgs/:orgId/users", controller.getUsersByOrgId);
router.get("/orgs/:orgId/labels", controller.getLabelsByOrgId);
router.post("/orgs/:orgId/labels", controller.createLabelByOrgId);
router.patch("/orgs/:orgId/users/:uid", controller.updateUserByOrgAndUserId);
router.delete("/orgs/:orgId/users/:uid", controller.deleteUserByOrgAndUserId);

export default router;