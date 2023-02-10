import axios from "axios";

import type Org from "@/types/org";
import type User from "@/types/user";

const baseUrl = "http://127.0.0.1:3000";

const fetchOrgs = async (per_page: number = 20): Promise<Org[]> => {
  const orgs: Org[] = [];
  let page = 1;
  let total_pages = 1;

  const fetch = async (per_page: number, page: number): Promise<any> =>
    await axios.get(`${baseUrl}/orgs`, {
      params: { page, per_page },
    });

  while (total_pages ? page <= total_pages : false) {
    try {
      const response = await fetch(per_page, page);
      orgs.push(...(response.data?.data as Org[]));
      total_pages = response.data?.meta?.total_pages;
      page++;
    } catch (err) {
      console.log(`Oops, something is wrong: ${err}`);
    }
  }
  return orgs;
};

const fetchUsers = async (
  orgs: Org[],
  per_page: number = 20
): Promise<User[]> => {
  const users: User[] = [];

  const fetch = async (
    orgId: string,
    per_page: number,
    page: number
  ): Promise<any> =>
    await axios.get(`${baseUrl}/orgs/${orgId}/users`, {
      params: { page, per_page },
    });

  for await (const org of orgs || []) {
    let page = 1;
    let total_pages = 1;

    while (total_pages ? page <= total_pages : false) {
      try {
        const response = await fetch(org?.id, per_page, page);
        users.push(
          ...((response.data?.data as User[]) || []).map((u: User) => ({
            ...u,
            org_name: org.name,
          }))
        );
        total_pages = response.data?.meta?.total_pages;
        page++;
      } catch (err) {
        console.log(`Oops, something is wrong: ${err}`);
      }
    }
  }
  return users.sort((a: User, b: User) => {
    if (a.last_name < b.last_name) return -1;
    if (a.last_name > b.last_name) return 1;
    return 0;
  });
};

const fetchLabels = async (orgId: string): Promise<string[]> => {
  return await axios.get(`${baseUrl}/orgs/${orgId}/labels`);
};

const saveUser = async (user: User, mask: string[]): Promise<any> => {
  return await axios.patch(
    `${baseUrl}/orgs/${user.org}/users/${user.id}`,
    user,
    {
      params: { mask: mask.join(",") },
    }
  );
};

const createLabel = async (orgId: string, label: string): Promise<any> => {
  return await axios.post(`${baseUrl}/orgs/${orgId}/labels`, { label });
};

const removeUser = async (user: User): Promise<any> => {
  return await axios.delete(`${baseUrl}/orgs/${user.org}/users/${user.id}`);
};

export {
  fetchOrgs,
  fetchUsers,
  fetchLabels,
  saveUser,
  createLabel,
  removeUser,
};
