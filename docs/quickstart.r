# Load required libraries
library(httr)
library(dplyr)
library(jsonlite)

# Set the URL root to the address where BMDS server is currently running:
url_root <- Sys.getenv('BMDS_SERVER_URL', 'http://bmds-server.com')

# Create a data-frame that has two continuous dose-response datasets:
datasetsDf = data.frame(
     id=c(rep("run #1", 4), rep("run #2", 4)),
     doses=rep(c(0,1.96,5.69, 29.75), 2),
     ns=rep(c(75, 49, 50, 49), 2),
     means=c(479, 460, 462, 420, 2.61, 2.61, 2.96, 4.66),
     stdevs=c(43, 42, 39, 39, 0.36, 0.19, 0.17, 0.42)
)

# Group the data from a dataframe:
datasets <- datasetsDf %>%
    group_by(id) %>%
    summarize(doses=list(doses), ns=list(ns), means=list(means), stdevs=list(stdevs))

# Create a BMDS job. This example uses uses BMDS v2.6.0.1. with both datasets:
inputs <- list(
     id='My first BMDS-server run',
     dataset_type='C',
     bmds_version='BMDS2601',
     datasets=datasets
)

# Submit input data
inputs_json <- toJSON(inputs, auto_unbox=TRUE)
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
