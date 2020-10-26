---
layout: default
title: Contribution
parent: About
nav_order: 2
---

# Contributions

Pull requests welcome!

See [issues](/about/#issues) for reporting bugs or problems.

## Updating the Documentation

These docs are located within the same Github repository that is home to Makerverse. You'll find them in the `docs/` folder, stored as `.md` (markdown) files. Therefore, the contribution process is the same as changing the Makerverse code (_see below_). Once a pull request containing docs has been approved and merged, it will appear automatically on Makerverse.com.

_**Note**: to test your changes to the docs, run `bundle exec jekyll serve` from the `docs/` folder. You will need to have Ruby & Jekyll installed ([see their docs](https://jekyllrb.com/docs/installation/))._

## How to Contribute

As with contributing to most Github projects, the process is to (1) fork the repository, (2) make and push changes, and then (3) create a pull request. The pull request can then be reviewed and accepted into Makerverse.

### Fork the repository

If you're using <b>GitHub for Desktop</b> application, navigate over to the toolbar, open the <b>Clone or download</b> dropdown, and click <b>Open in Desktop</b> to clone makermadecnc/makerverse to your computer and use it in GitHub Desktop.

![image](https://user-images.githubusercontent.com/447801/30471510-956b51fe-9a2b-11e7-9e43-c5e3fa19e0cb.png)

### Making and pushing changes

Go ahead and make a few changes to the project using your favorite text editor. When you’re ready to submit your changes, type up a commit summary in <b>GitHub for Desktop</b>, and click <b>Commit to master</b>.

![image](https://user-images.githubusercontent.com/447801/30475410-568ff97c-9a39-11e7-9e25-a924ad910deb.png)

You can continue to make more changes and create new commits. When you’re ready to push your changes, click on the <b>Sync</b> button to synchronize master with the remote server.

![image](https://user-images.githubusercontent.com/447801/30475598-f5b90a34-9a39-11e7-870a-2517f124dbba.png)

### Creating the pull request

1. Head on over to the repository on GitHub.com where your project lives. For your example, it would be at `https://www.github.com/<your_username>/makerverse`.
  ![image](https://user-images.githubusercontent.com/447801/30475866-ce417044-9a3a-11e7-814f-c991a92a3be3.png)

2. To the right of the branch menu, click <b>New pull request</b>.<br>
  ![image](https://user-images.githubusercontent.com/447801/30476056-66f33548-9a3b-11e7-9d9a-e2d010cbc379.png)

3. Click <b>Create pull request</b>.
  ![image](https://user-images.githubusercontent.com/447801/30476803-bd3b1428-9a3d-11e7-8588-90d77f3680b5.png)

4. That's done.

## Development

See the [build from source](/installation/build-from-source/) section to get started.

## Localization

If you'd like to help contribute translations, you can fork the repository, update resource files in the `src/app/i18n` directory, and create a pull request to submit your changes.

## Translation Validation

You can validate the translation by copying translated resource files to the installed directory. Note that your path may differ based on the Node installation path you have in place.
```bash
$ cd $(dirname `which makerverse`)/../lib/node_modules/cncmakerversejs/dist/app/i18n/
$ pwd
/home/cheton/.nvm/versions/node/v10.15.3/lib/node_modules/makerverse/dist/app/i18n
```

To verify your changes during runtime, it's recommended that you open <b>Developer Tools</b> and disable browser cache. For example:

#### Step 1: Open Developer Tools and click [Settings]
![image](https://cloud.githubusercontent.com/assets/447801/16014196/cc4b730c-31c2-11e6-9f78-c84347d12190.png)

#### Step 2: Disable cache
![image](https://cloud.githubusercontent.com/assets/447801/16014264/1d32e872-31c3-11e6-9178-6cc06bd0f6b5.png)

Now you can copy resource files to the <b>dist/makerverse/app/i18n</b> directory and refresh your browser to see new updates.

<b>Note that you should not close DevTools to make sure your browser won't cache anything.</b>