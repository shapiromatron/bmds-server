# Load required libraries
library(httr)
library(plyr)
library(rjson)

# Set the URL root to the address where BMDS server is currently running
url_root <- Sys.getenv('BMDS_SERVER_URL', 'http://bmds-server.com')

# Create an example BMDS job. This example uses uses BMDS v2.6.0.1. with two
# dichotomous datasets:
inputs <- list(
    id='My first BMDS-server run',
    dataset_type='D',
    bmds_version='BMDS2601',
    datasets=list(
        list(
            id='run #1',
            doses=c(0, 1.96, 5.69, 29.75),
            ns=c(75, 49, 50, 49),
            incidences=c(5, 1, 3, 14)
        ),
        list(
            id=2,
            doses=c(0, 1.96, 5.69, 29.75),
            ns=c(75, 49, 50, 49),
            incidences=c(0, 0, 11, 27)
        )
    )
)

# Submit input data
inputs_json <- toJSON(inputs)
url <- sprintf('%s/api/job/', url_root)
response <- POST(url, body=list(inputs=inputs_json))

# If submission is successful, we'll get a HTTP 201 response (job created),
# along with a new unique identifier for this job:
if(response$status_code == 201){
    json <- content(response, 'parsed')
    job_id <- json$id
} else {
    # If submission fails, print response so we know why the job failed.
    print(content(response, 'text'))
}

# Each job is added to a queue on the server; when there are no other jobs
# running this job will be started. We can poll the results page (in this
# case waiting 15 seconds between requests) until the job is finished:
repeat{
    url <- sprintf('%s/api/job/%s/', url_root, job_id)
    response <- GET(url)
    json <- content(response, 'parsed')
    if(json$is_finished){
        outputs <- json$outputs
        break
    }
    Sys.sleep(15)
}

# After completion, the job returns model outputs. There's lots of
# information in the outputs, including the created dfile, output file,
# and results from the parsed output. If model-recommendations is enabled,
# then a model will also be recommended in the outputs. Here's a snapshot:
for (output in outputs$outputs){
    print('---')
    print(sprintf('Dataset: %s', toJSON(output$dataset)))
    print(sprintf('Number of models: %d', length(output$models)))
    for (model in output$models){
        print(sprintf('  %s: BMD -> %f', model$output$model_name, model$output$BMD))
    }
}
