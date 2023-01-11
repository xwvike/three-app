//创建一个函数，参数为两个数字，如果第一个数与第二个数相差范围小于正负10，则返回true，否则返回false
export function isNear(num1, num2) {
  return Math.abs(num1 - num2) < 30
}
