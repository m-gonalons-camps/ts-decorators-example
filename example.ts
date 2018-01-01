/* tslint:disable */ 
import { setTimeout } from "timers";

function decoratorExample(
    targetedClass: object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
) {
    const invokedMethod = descriptor.value;
    const isAsync = (descriptor.value as any)[Symbol.toStringTag] === "AsyncFunction";

    descriptor.value = function(...args: any[]) {
        let result: any;

        console.log(">>>> Decorator start");
        console.log(">>>> Class: " + targetedClass.constructor.name.toString());
        console.log(">>>> Method: " + methodName);
        console.log(">>>> Aguments: " + args);

        if (isAsync) {
            result = new Promise(async (resolve: (result: any) => void) => {
                resolve(await invokedMethod.apply(this, args));
            }).then((result: any) => {
                console.log(">>>> Async decorator end with result: " + result);
                return result;
            });
        } else {
            result = invokedMethod.apply(this, args);
            console.log(">>>> Sync method decorator end with result: " + result);
        }

        return result;
    };

    return descriptor;
}


class Example {

    @decoratorExample
    public syncTest(p1: string, p2: number): string {
        return "syncTest result (" + p1 + " " + p2 + ")";
    }

    @decoratorExample
    public async asyncTestPromiseSuccess(p1: string, p2: number): Promise<any> {
        return await new Promise((resolve: (result: string) => any, reject: (result: string) => any) => {
            setTimeout(() => {
                resolve("SUCCESS PROMISE result -> (" + p1 + " " + p2 + ")");
            }, 5000);
        });
    }

    @decoratorExample
    public async asyncTestPromiseReject(p1: string, p2: number): Promise<any> {
        return await new Promise((resolve: (result: string) => any, reject: (result: string) => any) => {
            setTimeout(() => {
                reject("REJECT PROMISE result -> (" + p1 + " " + p2 + ")");
            }, 2000);
        }).catch((result: any) => {
            return result;
        });
    }

}

const example = new Example();
let result;

result = example.syncTest("test 1", 123);
console.log("   >>>> " + result);
console.log("-----------------------");
result = example.asyncTestPromiseSuccess("test 2", 456);
result.then((r: string) => console.log("   >>>> " + r));
console.log("-----------------------");
result = example.asyncTestPromiseReject("test 3", 789);
result.then((r: string) => console.log("   >>>> " + r));
console.log("-----------------------");
