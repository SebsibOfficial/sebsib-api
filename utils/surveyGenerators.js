const { Survey } = require("../models");

// a function that generates a custom survey id for every survey,
// and ensures that the generated id is unique
customSurveyIdGenerator = async (name) => {
  const customSurveyId = name.toUpperCase().substring(0, 3) + name.toUpperCase().substring(name.length - 3, name.length) + Math.floor(Math.random() * 90 + 10);

  // Check if the generated customSurveyId is unique
  if (await Survey.exists({ shortSurveyId: customSurveyId })) return customSurveyIdGenerator(name);

  return customSurveyId;

}

// a function that generates a custom survey link for every survey, the link is a 
// randomly generated value, that contains letters and numbers, with a length of 8,
// and ensures that the generated link is unique
customSurveyLinkGenerator = async () => {
  const customSurveyLink = Math.random().toString(36).substr(2, 8);

  // Check if the generated customSurveyLink is unique
  if (await Survey.exists({ link: customSurveyLink })) return customSurveyLinkGenerator();

  return customSurveyLink;
}


module.exports = {
  customSurveyIdGenerator,
  customSurveyLinkGenerator,
}
