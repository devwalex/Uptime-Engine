'use strict'

const Project = use('App/Models/Project');
const Report = use('App/Models/Report');
const Event = use('Event');
const User = use('App/Models/User');

class ProjectController {

  async addProject({ request, response, auth }) {
    try {

      const { address, project_name, type } = request.post();
      const authenticatedUser = await auth.current.user;

      const project = new Project()
      project.address = address
      project.description = project_name
      project.user_id = authenticatedUser.id
      project.type = type
      await project.save()

      return response.status(201).json({
        status: 'Created',
        message: 'Project created successfully.',
        status_code: 201,
      });

    } catch (error) {
      console.error('Add Project Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async deleteProject({ response, params: { project_id }, auth }) {
    try {
      const authenticatedUser = await auth.current.user;

      const project = await Project.query()
        .where('id', project_id)
        .where('user_id', authenticatedUser.id)
        .where('is_deleted', false)
        .first()

      if (!project) {
        return response.status(404).json({
          status: 'Not Found',
          message: 'Project not found.',
          status_code: 404,
        });
      }

      project.is_deleted = true
      project.is_active = false
      project.is_monitored = false
      await project.save()

      return response.status(200).json({
        status: 'Created',
        message: 'Project deleted successfully.',
        status_code: 200,
      });

    } catch (error) {
      console.error('Delete Project Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async editProject({ response, request, params: { project_id }, auth }) {
    try {

      const { project_name } = request.post();

      const authenticatedUser = await auth.current.user;

      const project = await Project.query()
        .where('id', project_id)
        .where('user_id', authenticatedUser.id)
        .where('is_deleted', false)
        .first()

      if (!project) {
        return response.status(404).json({
          status: 'Not Found',
          message: 'Project not found.',
          status_code: 404,
        });
      }

      project.description = project_name
      await project.save()

      return response.status(200).json({
        status: 'Success',
        message: 'Project updated successfully.',
        status_code: 200,
      });

    } catch (error) {
      console.error('Edit Project Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async toggleProjectMonitoringStatus({ response, request, params: { project_id }, auth }) {
    try {

      const { is_monitored } = request.post();

      const authenticatedUser = await auth.current.user;
      const project = await Project.query().where('id', project_id)
        .where('user_id', authenticatedUser.id)
        .where('is_deleted', false)
        .first()


      if (!project) {
        return response.status(404).json({
          status: 'Not Found',
          message: 'Project not found.',
          status_code: 404,
        });
      }

      if (!project.is_active && is_monitored === true) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'Project needs to be active in other to be monitored.',
          status_code: 400,
        });
      }

      project.is_monitored = is_monitored
      await project.save()

      return response.status(200).json({
        status: 'Success',
        message: 'Project monitoring status updated successfully.',
        status_code: 200,
      });

    } catch (error) {
      console.error('Toggle Project Monitoring Status Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async projectListing({ response }){
    try {
      const projects = await Project.query()
      .where('is_active', true)
      .where('is_monitored', true)
      .where('is_deleted', false)
      .fetch()

      return response.status(200).json({
        status: 'Success',
        message: 'Fetched all active project successfully.',
        status_code: 200, 
        results: projects
      });

    } catch (error) {
      console.error('Project Listing Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

  async updateProjectReportStatus({response, request, params: { project_id }}){
    try {

      const { current_status, last_status_change_time, ssl_expiration_date, reason, load_time } = request.post();

      const project = await Project.query()
      .where('id', project_id)
      .where('is_deleted', false)
      .first()

      if (!project) {
        return response.status(404).json({
          status: 'Not Found',
          message: 'Project not found.',
          status_code: 404,
        });
      }

      if (!project.is_active) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'This project has been deactivated.',
          status_code: 400,
        });
      }

      if (!project.is_monitored) {
        return response.status(400).json({
          status: 'Bad Request',
          message: 'This project is not toggle on for monitoring.',
          status_code: 400,
        });
      }

      project.current_status = current_status
      project.last_status_change_time = last_status_change_time
      project.ssl_expiration_date = ssl_expiration_date
      await project.save()


      const report = new Report()
      report.project_id = project.id
      report.status = current_status
      report.last_status_change_time = last_status_change_time
      report.reason = reason
      report.load_time = load_time
      await report.save()

      const user = await User.query()
      .where('id', project.user_id)
      .first();
      
      const mailDetails = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        project,
        report
      };

      // It triggers the sendProjectCurrentStatusReport event
      Event.fire('sendProjectCurrentStatusReport', mailDetails); 

      return response.status(200).json({
        status: 'Success',
        message: 'Project report status updated successfully.',
        status_code: 200,
      });


    } catch (error) {
      console.error('Update Project Report Status Error ==>', error);
      return response.status(500).json({
        status: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status_code: 500,
        error,
      });
    }
  }

}

module.exports = ProjectController
