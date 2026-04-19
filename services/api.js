import axios from 'axios';

const API = axios.create({
  baseURL: 'https://job-portal-api-zi92.onrender.com',
});

export const authService = {
  login: (email) => API.get(`/users?email=${email}`),
  register: (userData) => API.post('/users', userData),
};

export const jobService = {
  getAllJobs: () => API.get('/jobs?status=approved'),
  getJobById: (id) => API.get(`/jobs/${id}`),
  postJob: (jobData) => API.post('/jobs', jobData),
  updateJobStatus: (id, status) => API.patch(`/jobs/${id}`, { status }),
};

export const appService = {
  applyToJob: (appData) => API.post('/applications', appData),
  getApplicationsByUserId: (userId) => API.get(`/applications?seekerId=${userId}`),
  getApplicationsByEmployer: (empId) => API.get(`/applications?employerId=${empId}`),
};

export default API;