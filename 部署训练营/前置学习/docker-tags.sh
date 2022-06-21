curl https://registry.hub.docker.com/v1/repositories/$1/tags\
| tr -d '[\[\]" ]' | tr '}' '\n'\
| awk -F: -v image='node' '{if(NR!=NF && $3 != ""){printf("%s:%s\n",image,$3)}}'