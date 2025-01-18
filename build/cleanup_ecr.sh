#!/bin/bash

IMAGES_TO_DELETE=$( aws ecr list-images --region us-east-1 --repository-name 	kitchen-companion/apps --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json )
aws ecr batch-delete-image --region us-east-1 --repository-name kitchen-companion/apps --image-ids "$IMAGES_TO_DELETE" || true
