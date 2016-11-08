#!/bin/bash

# Shell tmux script to start application

# create the session to be used
tmux new-session -d -s bmds_server

# split the window
tmux split-window -v
tmux split-window -h
tmux select-pane -t 0
tmux split-window -h

# run commands
tmux send-keys -t 0 "workon bmds-server" enter
tmux send-keys -t 1 "workon bmds-server && python manage.py shell" enter
tmux send-keys -t 2 "workon bmds-server && python manage.py runserver 5550" enter
tmux send-keys -t 3 "workon bmds-server && celery worker --app=bmds_server --loglevel=info --events" enter

# attach to shell
tmux select-pane -t 0
tmux attach-session
