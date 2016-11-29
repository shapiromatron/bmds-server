#!/bin/bash

# Shell tmux script to start application

# create the session to be used
tmux new-session -d -s bmds_server

# split the window
tmux split-window -v
tmux resize-pane -t 0 -y 12
tmux select-pane -t 0

tmux split-window -h

tmux select-pane -t 2
tmux split-window -v

tmux resize-pane -t 3 -y 12
tmux split-window -h
tmux split-window -h

# run commands
tmux send-keys -t 0 "workon bmds-server" enter
tmux send-keys -t 1 "workon bmds-server && python manage.py shell" enter
tmux send-keys -t 2 "workon bmds-server && python manage.py runserver 5550" enter
tmux send-keys -t 3 "workon bmds-server && celery worker --app=bmds_server --loglevel=info --events" enter
tmux send-keys -t 4 "workon bmds-server && make servedocs" enter
tmux send-keys -t 5 "workon bmds-server && python manage.py shell_plus --notebook" enter

# attach to shell
tmux select-pane -t 0
tmux attach-session
