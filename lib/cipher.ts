import * as crypto from 'crypto';
import { HexBase64BinaryEncoding, Utf8AsciiBinaryEncoding } from 'crypto'
import { ICipherOption } from '../types/index'


const IVLength = 16

export default class Cipher {
  keyBuffer: Buffer
  ivBuffer: Buffer
  constructor(option: ICipherOption) {
    this.keyBuffer = Buffer.alloc(option.secret.length, option.secret, 'utf8')
    this.ivBuffer = option.iv ? Buffer.alloc(IVLength, option.iv) : null
  }

  /**
   * 分析传入aes算法支持的秘钥位数
   * @param algorithm 算法
   */
  private parseAesAlgorithm (algorithm: string) {
    const match = algorithm.match(/(\d+)/)

    if (!match) {
      throw new Error('AES algotithm name is not standard, pls check')
    }

    const algSecretLength = +match[0]

    if (![128, 192, 256].includes(algSecretLength)) {
      throw new Error('AES algorithm secret length is not standard, pls check ')
    }

    return algSecretLength
  }
  /**
   * AES加密
   * @param text 需要加密的文本
   * @param algorithm 算法
   * @param outputEncoding 输出编码
   */
  public encryptAES(text: string, algorithm: string, outputEncoding: HexBase64BinaryEncoding) {
    if (!algorithm.match('aes')) {
      throw new Error('encryptAES only can process aes encryption')
    }
    if (!algorithm.match('ecb') && !this.ivBuffer) {
      throw new Error('non-ecb mode require IV, pls check')
    }
    const isECBMode = algorithm.match('ecb')
    const algSecretLength = this.parseAesAlgorithm(algorithm)
    const cipher = crypto.createCipheriv(algorithm, this.keyBuffer.slice(0, algSecretLength / 8), isECBMode ? '' : this.ivBuffer)
    const encrypted = cipher.update(text, 'utf8', outputEncoding);

    return encrypted + cipher.final(outputEncoding)
  }

  /**
   * AES解密
   * @param text 需要解密的文本
   * @param algorithm 算法
   * @param outputEncoding 输出编码
   */
  public decryptAES(text: string, algorithm: string, outputEncoding: Utf8AsciiBinaryEncoding) {
    if (!algorithm.match('aes')) {
      throw new Error('encryptAES only can process aes decryption')
    }
    if (!algorithm.match('ecb') && !this.ivBuffer) {
      throw new Error('non-ecb mode require IV, pls check')
    }
    const isECBMode = algorithm.match('ecb')
    const algSecretLength = this.parseAesAlgorithm(algorithm)
    const cipher = crypto.createDecipheriv(algorithm, this.keyBuffer.slice(0, algSecretLength / 8), isECBMode ? '' : this.ivBuffer)
    const encrypted = cipher.update(text, 'base64', outputEncoding);

    return encrypted + cipher.final(outputEncoding)
  }

  /**
   * DES加密
   * @param text 需要加密的文本
   * @param algorithm 算法
   * @param outputEncoding 输出编码
   */
  public encrypyDES(text: string, algorithm: string, outputEncoding: HexBase64BinaryEncoding) {
    if (!algorithm.match('des')) {
      throw new Error('encryptDES only can process des encryption')
    }
    const cipher = crypto.createCipheriv(algorithm, this.keyBuffer.slice(0, 8), '');
    const encrypted = cipher.update(text, 'utf8', outputEncoding);

    return encrypted + cipher.final(outputEncoding)
  }
  /**
   * DES解密
   * @param text 需要解密的文本
   * @param algorithm 算法
   * @param outputEncoding 输出编码
   */
  public decrypyDES(text: string, algorithm: string, outputEncoding: Utf8AsciiBinaryEncoding) {
    if (!algorithm.match('des')) {
      throw new Error('encryptDES only can process des encryption')
    }
    const cipher = crypto.createDecipheriv(algorithm, this.keyBuffer.slice(0, 8), '');
    const encrypted = cipher.update(text, 'base64', outputEncoding);

    return encrypted + cipher.final(outputEncoding)
  }
}
