import axios from 'axios';
import { convertParam, renderMessageError } from '@app/common/functionCommons';
import { convertCamelCaseToSnakeCase, convertSnakeCaseToCamelCase } from '@app/common/dataConverter';

export function createBase(api, data, loading = true) {
  const config = { loading };
  return axios
    .post(`${api}`, convertCamelCaseToSnakeCase(data), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function postBaseNotNotifcation(api, data, loading = true) {
  const config = { loading };
  return axios
    .post(`${api}`, convertCamelCaseToSnakeCase(data), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      return null;
    });
}
export function postRawData(api, data, loading = true) {
  const config = { loading };
  return axios
    .post(`${api}`, data, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllBase(api, query, loading = true) {
  const config = { loading };
  const params = convertParam(query);
  return axios
    .get(`${api}${params}`, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch(() => {
      return null;
    });
}

export function getAllPaginationBase(api, currentPage = 1, totalDocs = 0, query, loading = true) {
  const config = { loading };
  const params = convertParam(query, "&");
  return axios
    .get(`${api}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then((response) => {
      if (response.status === 200) {
        if (totalDocs) {
          return convertSnakeCaseToCamelCase(response.data);
        } else {
          return convertSnakeCaseToCamelCase(response.data.docs);
        }
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function getAllPaginationBaseByID(api, id, currentPage = 1, totalDocs = 0, query, loading = true) {
  const config = { loading };
  const params = convertParam(query, "&");
  return axios
    .get(`${api}/${id}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then((response) => {
      if (response.status === 200) {
        if (totalDocs) {
          return convertSnakeCaseToCamelCase(response.data);
        } else {
          return convertSnakeCaseToCamelCase(response.data.docs);
        }
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function getAllPaginationBaseByIDNotConvert(api, id, currentPage = 1, totalDocs = 0, query, loading = true) {
  const config = { loading };
  const params = convertParam(query, "&");
  return axios
    .get(`${api}/${id}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then((response) => {
      if (response.status === 200) {
        if (totalDocs) {
          return response.data.docs;
        } else {
          return response.data.docs;
        }
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function getAllPaginationBaseByIDNotConvertParamsString(
  api,
  id,
  currentPage = 1,
  totalDocs = 0,
  query,
  loading = true
) {
  const config = { loading };
  if (query) query = "&" + query;
  return axios
    .get(`${api}/${id}?page=${currentPage}&limit=${totalDocs}${query}`, config)
    .then((response) => {
      if (response.status === 200) {
        if (totalDocs) {
          return response.data.docs;
        } else {
          return response.data.docs;
        }
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function getAllPaginationBaseParamsString(api, currentPage = 1, totalDocs = 0, params, loading = true) {
  const config = { loading };
  if (params && params[0] != "&") params = "&" + params;
  return axios
    .get(`${api}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then((response) => {
      if (response.status === 200) {
        if (totalDocs) {
          return convertSnakeCaseToCamelCase(response.data);
        } else {
          return convertSnakeCaseToCamelCase(response.data.docs);
        }
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getByIdBase(api, id, loading = true) {
  const config = { loading };
  return axios
    .get(api.format(id), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function getAllPaginationBaseByIDParamsString(
  api,
  id,
  currentPage = 1,
  totalDocs = 0,
  params = "",
  loading = true
) {
  const config = { loading };
  return axios
    .get(`${api}/${id}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then((response) => {
      if (response.status === 200) {
        if (totalDocs) {
          return convertSnakeCaseToCamelCase(response.data);
        } else {
          return convertSnakeCaseToCamelCase(response.data.docs);
        }
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function getPaginationBase(api, id, currentPage = 1, totalDocs = 0, params = "", loading = true) {
  const config = { loading };
  return axios
    .get(`${api}/${id}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then((response) => {
      if (response.status === 200) {
        return convertSnakeCaseToCamelCase(response.data);
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function updateBase(api, data, loading = true) {
  const config = { loading };
  return axios
    .put(api.format(data._id), convertCamelCaseToSnakeCase(data), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function updateBaseFormatID(api, id, data, loading = true) {
  const config = { loading };
  return axios
    .put(api.format(id), convertCamelCaseToSnakeCase(data), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteByIdBase(api, id, loading = true) {
  const config = { loading };
  return axios
    .delete(api.format(id), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function deleteBase(api, loading = true) {
  const config = { loading };
  return axios
    .delete(api, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function createBaseSnackCase(api, data, loading = true) {
  const config = { loading };
  return axios
    .post(`${api}`, convertSnakeCaseToCamelCase(data), config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}






