## A simple microservices app using express docker k8s(kubernetes), ingress and skaffold

### event-bus serves as the event tracking platform
#### posts emits `PostCreated` event
#### commemnt emits `CommentCreated` event
#### moderation emits `CommentModerated` event

### it's been contanerized using dockerfile and multiple instances managed using kubernetes(k8s)
### the contents of infra/k8s folder manages our deployment
### the skaffold.yaml file manages watches for changes in docker images and manages redployment