/*
on_follow state machine:
    0-(created)         basic formal checks passed, queued in DB
    1-deciding          anything created is put into deciding automatically. If auto-acception or auto-refusal set, move to 3, otherwise to 2
    2-pending-approval  pending human approval, then to 3
    3-accepted|refused  approval or refusal known, but not yet sent to remote, then to 4
    4-(finished)        this following request can be recorded and then deleted
*/


export type FedifyProcessingStatusOnFollow_t = 
    "on_follow_deciding"         |
    "on_follow_pending_approval" |
    "on_follow_accepted"         |
    "on_follow_refused"
;