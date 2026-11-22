import { api } from "./config";

const resource = (type) => `admin/${type}/`;
export const adminCatalogApi = {
  list: (type, params = {}) => api.get(resource(type), { params }),
  create: (type, data) => api.post(resource(type), data),
  update: (type, id, data) => api.patch(`${resource(type)}${id}/`, data),
  disable: (type, id) => api.delete(`${resource(type)}${id}/`),
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("media/images/", form);
  },
};
