import { spawnSync } from "child_process";
import { off } from "process";

export abstract class CargoHelper {
    /**
     * 检查是否安装cargo
     * @returns true/false
     */
    public static ok(): boolean {
        let p = spawnSync("cargo --version");
        if (!p) {
            return false;
        }
        return (0 === p.status);
    }

    /**
     * 获取当前cargo的版本
     * @returns cargo版本信息
     */
    public static version(): string {
        let p = spawnSync("cargo --version");
        return p.stdout.toString();
    }

    /**
     * 创建项目
     * @param name 项目名称
     * @returns
     */
    public static createProject(name: string): boolean {
        if (!this.ok()) {
            return false;
        }

        let p = spawnSync("cargo new " + name);
        if (!p) {
            return false;
        }

        return (0 === p.status);
    }

    /**
     * 添加项目依赖
     * @param name 依赖名称
     * @returns
     */
    public static addDependency(name: string): boolean {
        let p = spawnSync("cargo add " + name);
        if (!p) {
            return false;
        }

        return (0 === p.status);
    }
}
