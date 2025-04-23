import { IconsEnum } from "./iconsEnum";

export const enum QuickreplyHTMLEnum {
  FILENAME = `<input id="upload_filename" type="text" name="filename" placeholder="No file selected." />`,
  FILENAME_CLEAR = `<td><a id="reset-qr-fileinput" href="javascript:;" title="Remove attachment">${IconsEnum.CLOSE}</a></td>`
}