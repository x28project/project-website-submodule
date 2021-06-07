const { projects } = global;

module.exports = {
  PROJECTS_IFRAMES: JSON.stringify(
    projects.reduce((accumulator, project) => {
      if (project.iframe) {
        accumulator.push({
          abbr: project.abbr,
          src: project.iframe.src,
          zip: project.zip,
        });
      }
      return accumulator;
    }, [])
  ),
  PROJECTS_DROPDOWNS: JSON.stringify(
    projects.reduce((accumulator, project) => {
      if (project.cover || project.zip) {
        accumulator.push({
          abbr: project.abbr,
          ...(project.cover &&
            project.cover.src && { cover: project.cover.src }),
          ...(project.zip && { zip: project.zip }),
        });
      }
      return accumulator;
    }, [])
  ),
};
