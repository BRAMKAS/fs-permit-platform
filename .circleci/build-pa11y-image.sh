docker-compose build --build-arg PLATFORM="$PLATFORM" --build-arg VCAP_SERVICES="$VCAP_SERVICES" --build-arg VCAP_APPLICATION="$VCAP_APPLICATION"  --build-arg SNYK_TOKEN="$SNYK_TOKEN" fs-intake-pa11y
