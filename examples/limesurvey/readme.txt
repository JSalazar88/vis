Instructions for configuring the vis-timeline control to work within a LimeSurvey questionnaire

1. Login to LimeSurvey as an administrator.

2. There are 2 ways to apply resorces (js, css, images, files) to a survey:  (A) apply to a survey, or (B) apply to a theme.
    Follow instructions for one of these two options (A or B):

    (A) Apply to Survey (preferred)    
        1. Select a survey from the "Surveys" menu.

        2. Upload the following files to the survey. In the LS menu, select "Configuration -> Themes".  Click "Upload a file" in the right-hand side of the Theme Editor.
            * starsLeft.png
            * starsRight.png
            * vis.js
            * vis-timeline-graph2d.min.css

        3. Ensure that the survey has the following questions in Demographics question group.  Question name (code) must match the valus below exactly since they are referenced by the showGraph question source:
            * BedTime
            * LightsOutTime
            * WakeTime
            * OutOfBedTime
            * SOL
            * TST 
            * showGraph (name/code not important for this one)

        Notes: 
            * Files uploaded to the survey are available publicly at:
                https://<LimeSurvey_base_url>/upload/surveys/<survey_id>/files/<filename>
            * This method is preferred since the showGraph question source is "aware" of the survey and coded to 
                * When copying the survey, the showGraph question source should not need to be modified.  It will automatically work in a new survey.
            * Survey resources (files, images) are NOT copied over when copying a survey.  They must be uploaded separately.

    (B) Apply to Theme
        1. To change the theme that a survey Go to "Settings -> General Settings -> Template" and choose 

        2.  Upload the following files to the theme you're using in your survey. In the LS menu, select "Configuration -> Themes".  Click "Upload a file" in the right-hand side of the Theme Editor.
            * starsLeft.png
            * starsRight.png
            * vis.js
            * vis-timeline-graph2d.min.css

        3. Ensure your survey is using the correct theme.  Select the Survey from the "Surveys" menu.  Then go to "Settings -> General Settings -> Template" and choose the theme from the drop-down menu to apply it to the survey.
        
        Notes: 
            * Files uploaded to a theme are available publicly at: 
                https://<LimeSurvey_base_url>/upload/themes/survey/<theme_name>/files/<filename>
            * Once the theme is configured, multiple surveys can use it without uploading the files to each theme (i.e. surveys for test, production, development, multiple versions, etc.)
            * The disadvantages are that you will need to modify the showGraph question source to hardcode question IDs and the theme names, as theme properties are not available to the LimeSurvey Expression Manager in the way that survey properties are. 
            
Word of caution when modifying question source: when using brackets ({ and }) within JavaScript in survey questions: the LimeSurvey Expression Manager uses brackets ({ and }) to enclose expressions. 
    You must add a space or line feed after the opening bracket ({) and before the closing bracket (}).