Instructions for configuring the timeline control to work within a LimeSurvey questionnaire

1. Login to LimeSurvey as an administrator.

2. Modify the theme you're using (or intend to use) for the survey. In the LS menu, select "Configuration -> Themes"
    * To change the theme you're using, select your Survey from the "Surveys" menu.  Then go to "Settings -> General Settings -> Template" and choose your theme from the drop-down menu.

3. Upload the following files in the Theme Editor (right-hand side under "Upload a file")
   * stars.png
   * starsLeft.png
   * starsRight.png
   * vis.css (?)
   * vis.js
   * vis-timeline-graph2d.min.css
   * vis-timeline-graph2d.min.js (?)

    Note: files uploaded to a theme are available publicly at: 
        https://<LimeSurvey base url>/upload/themes/survey/<theme name>/files/

    Alternatively, you can upload files to a survey instead of the theme.  Select your survey from the "Surveys" menu.  Then go to "Settings -> Resources"
        Note: survey resources (files, images) are NOT copied over when copying a survey.  They must be uploaded explicity.
    
Caution when using brackets ({ and }) within JavaScript in survey questions: the LimeSurvey Expression Manager uses brackets ({ and }) to enclose expressions. 
    You must add a space or line feed after the opening bracket ({) and before the closing bracket (}), otherwise LimeSurvey will render the survey question with errors.