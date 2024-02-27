console.log("Hello Task Processing");

(async () => {
  console.log("=======================================")
  await scenario1();
  console.log("=======================================")
  await scenario2();
  console.log("=======================================")
  await scenario3a();
  console.log("=======================================")
  await scenario3b();
  console.log("=======================================")
  await scenario4();
})();

async function scenario4() {
  // hybrid
  console.log("==== start scenario4 ==== when task1 process longer than task2 by await result after call fn()");
  const t1 = task("task1", 3)
  const t2 = (() => {
    const name = "task2";
    const second = 2;
    setTimeout(() => {
      console.log(`Delayed ${name} for ${second} second.`);
    }, second * 1000);
    return second;
  })();
  const t3 = task("task3", 1);

  const [result1, result2, result3] = [await t1, t2, await t3];
  console.info(`t1:${result1} + t3:${result3} = ${result1 + result3}`);
}

async function scenario3b() {
  console.log("==== start scenario3-b ====\n" + 
    "when task1 process longer than task2 by using Promise.all to execute multiple tasks without having to wait for another task to finish.\n" +
    "using .then callback until done both tasks from await");
  const t1 = task("task1", 3);
  const t2 = task("task2", 2);
  const t3 = task("task3", 1);
  const [result1, result2, result3] = await Promise.all([t1, t2, t3]).then(([val1, val2, val3]) => {
    return [val1, val2, val3];
  });
  console.info(`t1:${result1} + t3:${result3} = ${result1 + result3}`);
}

async function scenario3a() {
  console.log("==== start scenario3-a ====\n" +
    "when task1 process longer than task2 by using .then callback until done each task from await");
  const t1 = task("task1", 3);
  const t2 = task("task2", 2);
  const t3 = task("task3", 1);
  const [result1, result2, result3] = [
    await t1.then((val) => { return val; }), 
    await t2.then((val) => { return val; }),
    await t3.then((val) => { return val; })
  ];
  console.info(`t1:${result1} + t3:${result3} = ${result1 + result3}`);
}

async function scenario2() {
  console.log("==== start scenario2 ==== when task1 process longer than task2 by await result after call fn()");
  const t1 = task("task1", 3);
  const t2 = task("task2", 2);
  const t3 = task("task3", 1);
  const [result1, result2, result3] = [await t1, await t2, await t3]; // tuple
  console.info(`t1:${result1} + t3:${result3} = ${result1 + result3}`);
}

async function scenario1() {
  console.log("==== start scenario1 ==== when task1, task2 process sequentially by await on call fn()");
  const t1 = await task("task1", 3);
  const t2 = await task("task2", 2);
  const t3 = await task("task3", 1);
  console.info(`t1:${t1} + t3:${t3} = ${t1 + t3}`);
}

function task(name: string, second: number): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Delayed ${name} for ${second} second.`);
      resolve(second);
    }, second * 1000);
  });
}
