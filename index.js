// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const core = require("@actions/core");
const { runBuild } = require("./code-build");
const assert = require("assert");

/* istanbul ignore next */
if (require.main === module) {
  run();
}

module.exports = run;

async function run() {
  // core.getInput treats YAML booleans as strings
  const waitForBuild =
    core.getInput("wait-for-build", { required: false }).toLowerCase() ===
    "true"; // coerce to boolean

  console.log("*****STARTING CODEBUILD*****");
  try {
    const build = await runBuild(waitForBuild);
    core.setOutput("aws-build-id", build.id);

    // Signal the outcome
    if (waitForBuild) {
      assert(
        build.buildStatus === "SUCCEEDED",
        `Build status: ${build.buildStatus}`
      );
    } else {
      assert(true, `Build status: ${build.buildStatus}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    console.log(`*****CODEBUILD ${waitForBuild ? "COMPLETE" : "STARTED"}*****`);
  }
}
