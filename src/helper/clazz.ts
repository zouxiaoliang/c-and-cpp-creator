export abstract class ClazzHelper {
    public static isValid(name: string): boolean {
        if (name.charAt(0) >= '0' && name.charAt(0) <= '9') {
            return false;
        }
        // for (var x in "~!@#$%^&*()_+{}|:\"<>?".split("")) {
        //     if (name.indexOf(x)) {
        //         return false;
        //     }
        // }
        return true;
    }
}