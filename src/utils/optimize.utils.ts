import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import StandardError from './error.utils';

export class OptimizeUtils {
  public static async optimize(
    files: Express.Multer.File[],
  ): Promise<Express.Multer.File[]> {
    const optimizationPromises: Promise<Buffer>[] = files.map((file) => {
      return this.optimizeFile(file);
    });

    const filesOptimizated = await Promise.all(optimizationPromises);

    files.forEach((file, index) => {
      file.buffer = filesOptimizated[index];
    });

    return files;
  }

  private static async optimizeFile(file: Express.Multer.File) {
    const fileBuffer = Buffer.from(file.buffer);

    const { buffer } = imagemin;

    try {
      return buffer(fileBuffer, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      });
    } catch (error) {
      throw new StandardError(503, 'Error optimizing file: ' + error);
    }
  }
}
