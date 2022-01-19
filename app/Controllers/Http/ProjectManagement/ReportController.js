'use strict'

const Report = use('App/Models/Report');

class ReportController {

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

}

module.exports = ReportController
