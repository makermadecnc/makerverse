#!/bin/bash
PACKAGE_NAME=`node -e "console.log(require('./src/package.json').name)"`
PACKAGE_VERSION=`node -e "console.log(require('./src/package.json').version)"`
PRODUCT_NAME=Makerverse
RELEASE=${PACKAGE_NAME}-${PACKAGE_VERSION}
echo "$PACKAGE_NAME"
echo "$PACKAGE_VERSION"
echo "$PRODUCT_NAME"
echo "$RELEASE"
npm run coveralls
mkdir -p releases

# build:mac-x64
if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  # https://github.com/electron-userland/electron-builder/issues/398
  security import "scripts/certs/Certum-Code-Signing-CA-SHA2.cer" -k ~/Library/Keychains/login.keychain -T /usr/bin/codesign;
  # https://github.com/electron-userland/electron-osx-sign/issues/83
  # Temporarily Bypass Gatekeeper
  sudo spctl --master-disable;
  sudo spctl --status;
  npm run build:mac-x64;
  ls -al output output/*;
  cp -af "output/${PRODUCT_NAME}-${PACKAGE_VERSION}.dmg" "releases/${RELEASE}-mac-x64.dmg";
  ls -al releases/*;
  if [[ "$TRAVIS_BRANCH" == "master" && -z "$TRAVIS_TAG" && ! -z "$(ls -A releases)" ]]; then
    npm run github-release -- delete \
      --owner=makerverse \
      --repo=makerverse \
      --tag="${TRAVIS_BRANCH}-latest" \
      --name="${TRAVIS_BRANCH}" \
      "*-mac-x64.dmg";
    npm run github-release -- upload \
      --owner=makerverse \
      --repo=makerverse \
      --tag="${TRAVIS_BRANCH}-latest" \
      --name="${TRAVIS_BRANCH}" \
      --body="${COMMIT_LOG}" \
      "releases/${RELEASE}-mac-x64.dmg";
    rm -f "releases/${RELEASE}-mac-x64.dmg";
  fi
fi

# build:linux-ia32
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  npm run build:linux-ia32;
  ls -al output output/*;
  cp -af "output/${PRODUCT_NAME}-${PACKAGE_VERSION}-i386.AppImage" "releases/${RELEASE}-linux-i386.AppImage";
  cp -af "output/${PACKAGE_NAME}_${PACKAGE_VERSION}_i386.deb" "releases/${RELEASE}-linux-i386.deb";
  cp -af "output/${PACKAGE_NAME}-${PACKAGE_VERSION}.i686.rpm" "releases/${RELEASE}-linux.i686.rpm";
  pushd releases;
  ln -sf ../output/linux-ia32-unpacked "${RELEASE}-linux-ia32";
  tar zcfh "${RELEASE}-linux-ia32.tar.gz" "${RELEASE}-linux-ia32";
  rm -f "${RELEASE}-linux-ia32";
  popd;
  ls -al releases/*;
  if [[ "$TRAVIS_BRANCH" == "master" && -z "$TRAVIS_TAG" && ! -z "$(ls -A releases)" ]]; then
    npm run github-release -- delete \
      --owner=makerverse \
      --repo=makerverse \
      --tag="${TRAVIS_BRANCH}-latest" \
      --name="${TRAVIS_BRANCH}" \
      "*-linux-i386.AppImage" \
      "*-linux-i386.deb" \
      "*-linux.i686.rpm" \
      "*-linux-ia32.tar.gz";
    npm run github-release -- upload \
      --owner=makerverse \
      --repo=makerverse \
      --tag="${TRAVIS_BRANCH}-latest" \
      --name="${TRAVIS_BRANCH}" \
      --body="${COMMIT_LOG}" \
      "releases/${RELEASE}-linux-i386.AppImage" \
      "releases/${RELEASE}-linux-i386.deb" \
      "releases/${RELEASE}-linux.i686.rpm" \
      "releases/${RELEASE}-linux-ia32.tar.gz";
    rm -f "releases/${RELEASE}-linux-i386.AppImage";
    rm -f "releases/${RELEASE}-linux-i386.deb";
    rm -f "releases/${RELEASE}-linux.i686.rpm";
    rm -f "releases/${RELEASE}-linux-ia32.tar.gz";
  fi
fi

# build:linux-x64
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  npm run build:linux-x64;
  ls -al output output/*;
  cp -af "output/${PRODUCT_NAME}-${PACKAGE_VERSION}.AppImage" "releases/${RELEASE}-linux-x86_64.AppImage";
  cp -af "output/${PACKAGE_NAME}_${PACKAGE_VERSION}_amd64.deb" "releases/${RELEASE}-linux-amd64.deb";
  cp -af "output/${PACKAGE_NAME}-${PACKAGE_VERSION}.x86_64.rpm" "releases/${RELEASE}-linux.x86_64.rpm";
  pushd releases;
  ln -sf ../output/linux-unpacked "${RELEASE}-linux-x64";
  tar zcfh "${RELEASE}-linux-x64.tar.gz" "${RELEASE}-linux-x64";
  rm -f "${RELEASE}-linux-x64";
  popd;
  ls -al releases/*;
  if [[ "$TRAVIS_BRANCH" == "master" && -z "$TRAVIS_TAG" && ! -z "$(ls -A releases)" ]]; then
    npm run github-release -- delete \
      --owner=makerverse \
      --repo=makerverse \
      --tag="${TRAVIS_BRANCH}-latest" \
      --name="${TRAVIS_BRANCH}" \
      "*-linux-x86_64.AppImage" \
      "*-linux-amd64.deb" \
      "*-linux.x86_64.rpm" \
      "*-linux-x64.tar.gz";
    npm run github-release -- upload \
      --owner=makerverse \
      --repo=makerverse \
      --tag="${TRAVIS_BRANCH}-latest" \
      --name="${TRAVIS_BRANCH}" \
      --body="${COMMIT_LOG}" \
      "releases/${RELEASE}-linux-x86_64.AppImage" \
      "releases/${RELEASE}-linux-amd64.deb" \
      "releases/${RELEASE}-linux.x86_64.rpm" \
      "releases/${RELEASE}-linux-x64.tar.gz";
    rm -f "releases/${RELEASE}-linux-x86_64.AppImage";
    rm -f "releases/${RELEASE}-linux-amd64.deb";
    rm -f "releases/${RELEASE}-linux.x86_64.rpm";
    rm -f "releases/${RELEASE}-linux-x64.tar.gz";
  fi
fi