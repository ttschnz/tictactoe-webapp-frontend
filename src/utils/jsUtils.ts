import config from "./config";
const jsUtils = {
    changeTitle: (title: string) => {
        document.title = `${title} - ${config.title}`;
    },
};
export default jsUtils;
