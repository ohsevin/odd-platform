import { AppBar, appBarClasses, Grid, Toolbar } from '@mui/material';
import { maxContentWidth, maxSidebarWidth, toolbarHeight } from 'lib/constants';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import UserIcon from 'components/shared/Icons/UserIcon';

export const Bar = styled(AppBar)(({ theme }) => ({
  [`&.${appBarClasses.root}`]: { backgroundColor: theme.palette.common.white },
}));

export const Container = styled(Toolbar)(({ theme }) => ({
  minHeight: `${toolbarHeight}px`,
  height: `${toolbarHeight}px`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: '1px solid',
  borderBottomColor: theme.palette.divider,
}));

export const ContentContainer = styled(Grid)(({ theme }) => ({
  position: 'relative',
  paddingLeft: `${maxSidebarWidth}px`,
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up(maxContentWidth + maxSidebarWidth)]: { justifyContent: 'center' },
}));

export const LogoContainer = styled(Grid)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  width: '100%',
  height: toolbarHeight,
  display: 'flex',
  alignItems: 'center',
  maxWidth: `${maxSidebarWidth}px`,
  position: 'fixed',
  top: 0,
  left: 0,
  color: theme.palette.common.black,
}));

export const Title = styled(Link)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.common.black,
  textDecoration: 'none',
  [theme.breakpoints.up('sm')]: { alignItems: 'center' },
}));

export const Logo = styled('div')(({ theme }) => ({
  width: '32px',
  height: '32px',
  marginRight: theme.spacing(0.5),
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundImage:
    "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP4AAAD+CAYAAAAalrhRAAAPs3pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja7ZlZkjO7rYTfuQovgSQIDsvhAEZ4B16+P5TUOv94bN/rFzvc6lapSyUOQCIzUQr2t7/e8Bd+SpEcirZeR62RnzLKyJMXPb5+xvOcYnmen59r7/fS9+fD543MKeEor3/bfF8/Oa9/fOBrjrS+Px/6+53c3wOlz8DPj/jM/vp8u0jO59f5VN4DjfeK6ujt26Wu90D7feGzlPdf+SzrdfD/w3cnGlE6ykSSs0mS+DyX1wrE/5JMjo3nLJ3r/DFFpQUOScZ7MALy3fa+jjF+G6Dvgvz1KvwY/c+rH4Kf5/u8/BDL+o4RL375RtIfzstnmvztxPJZUf7+jTTTz9t5/917+n3wwiZmqUS0vhH1BDt9DcOFi5DL87HKo/GnvG7PY/DoccZNyk/ccfHYaaRMVm5IJR1WcZM9x502SyzZcuOY8yZRfq5LyyNvckQW/ZFubjLkSCd/O1sQ4XT+rCU9845nvp06M5/EpTkxWOIjv32EP3vzX3mEe7eHKMX+iRXryo5rluGZ82euIiHpvvOmT4C/Hu/0x2/w41AtXOZh7mxwxvUaYmn6A1vy5Fm4Tjm+SiiFdt4DECLmVhaThAzEmkRTTbHl3FIijp0EgY2epeRFBpJqPiwyF5GaQ8uUDHPzmZaea7Pmmv003EQiVCq11cnQJFmlKPhppYOhqaJFVas27UGHziq1VK21tuokN5u00rTV1lpvo80uvXTttbfe++hz5CFwoI462uhjjDlzmEw0GWty/eTMyktWWbrqaquvseYGPrts3XW33ffY8+QjB5o49bTTzzjTUjCYwoqpVWvWbdi8YO3KLVdvve32O+78ZO2d1Z8e/0LW0jtr+cmUX9c+WeNsaO1riOR0op4zMpZLIuPNMwCgs+cs9lRK9sx5zuLIFIVmFqmem3CSZ4wUFktZb/rk7o/M/VN5C9r/qbzlf5S54Kn7d2QukLqf8/aLrB3Xuf1k7FWFHtMoVB/XzNwDfzHy9P89/m+g/46B5gHOt54qye7qQ9VL7uxrqZyiexyKWbMmbUMWgnWSnwzW+o5W5pmUdIJbKHeY1NppV/O4MtaojLVy39TMRrpA/lGjdI6iZbDvSXUFTkwf3mqu127qVg7Qv7edMVumbNpJXhKnrNtXrUuv7T3alYR+113kjnQt4PEq4+x0VutUOqLYj9nymSUa1TYpLwp8NAS4GGVibQ1TRprW5uh5oqI1sIMic2JHEYcpS23fvY9NmCdRk8UdVlU5sVPXVmR1D+giBglXRjFPLahJKP1CVGPHPVdKxKfOmZLVkftocJQdzsjZ1mGGm3df2k9Bq0ZZe2ABiNuldHFsR1chNodBSiSAuelthg9uehIuosAUc5yWd4TFlpRtl0G3HmmbN9N09gx69xjFx8Rm7wqR1FV7gnQ6IRjkW4m6dMPWYFwgLlyN8osl57kNIlHq2mHNVU+xfWpcCFR++Lr3sxnG6q3TRO5CApNPNu5dkNO6+1wTNeLMhapzhMkqtS5SCBEOqFaOVaIRAYPHurHFSxaBBgMJRIdMn7lm9/8JzyFdjBrqvQkw35Vqu9uWASjWscDkFe8v+CzLmnJhTT5KAP35DlZVx2ZDxnZRkcx0THltvSfrSzzOt+HnXgPa9QHXmQDy6l4lSz1XfFGWcNY5r6mB0FsmzBPul9qpEiNEPithzb5/tTQh/XsoMU0CooACmGp1UpBzbrHq5E9+wSGGE6B7JZKB80qWZ2ivV0UzsaeqEcEsp3IJOllWq8RnxYsc9eZC4HHKgyJVBYkIz1xau9vHsRmSwYv3YjqPnRZdY/I51Bv64hJ1hfQ3yWPkStagCq9SYaeo6gYL69yZkERWWrtdLhhUKfo1a85gqJ7zFAyQC8z5fu2t1ut40kHWgcNBgCmgvliVIdy7UTNDz6loXd9pDoWxakIRw6WkANAk176dRFFX6qFQCqxeDLGs1T+9lbLIhVIEZ4aFOFgJpJWyoQQX2n+tOJU0EQMzd8RSHhTr2eCiQ2Jr4SJWUoCYdZdC8wqwTrzTZ6ZKvWjNLSjYbI1P44dAzCVG/VBMYAliwo5qngsfczqO5dn+1cLFcZ57EpV7WwqzLZjGInVGZFumwNRnItuKKyoVtNBKYGC6M/bKLN906d6Ctcr7RiEbpwf6T8V4QIUzgm7Sh6OBvTNgoWxbuT6fGjS3+xAKnTh5K9PJQ2wdWG+IuITh0GbXo/cN6iWvVmQf4O6117Vu6nX1J2qwpKPIgwfUHjZgd8MDA7ERmZSwpdTrIEVPSWKnuFyHNVQo1xcBtTri61X8HMuF1AlvFRhyI2IiW3O+uDYhksyGC+3k6IBxhZ7tEMcFQuG3lREN6I94QXWZViAaDGmdubw9gwBxkE8BmblNhAq8l6MEiARCAgXn3h1kExKZ7JKQANJNnV4NCSY9jXC1KXTcwoDjQN1HNzAdkCA7hjXPlhoHaqXJyDT1QXET6MtmFt1hwG/KgOAxn5bv2hnwJGUIykrSOvBWm43BID0gcnURoDZcgxd1ixIPCi+dQGEgMRV8f8W0DasPZ/jdit8cE/tnlgKd6O1dzwosgO1gTG8VhTe9SjytT538USUEAg8f8czEAsDdxobtwnWjwAd6wzYHuvLktjYTQzivzmxrjYsGCqOtiRSLYZyJwsNzsCxc+DExtlvYaflVaxUqfM2GSwGJ7gYa9UQEsz8N/i+1QTALS4xvntvg2GGI9dAGlwb0bhcIDDKGBvKqj0rohjVBRl2YFXOcO8vIuRBRpqmfngUj7UCZgibtYbky0fefprWhEN8iOf2E5A+iUdUGJibFC7DR1lDIckUuKTS6VIMBYNtBwdBWlOS2heXh2FDKuCImBYQQP6Sp3jkGBIwWgx4EcmTV6+YFlcSkQHqoIRunWaEE4aUpRuDoB3dHIRZ9SkQXC7kRNHoOgBhrKJnc08MhDInP0O4gBwv/aE1ofmi6IFLN9jQzpqAZzjrlxW8zly+eDz8S/+cIx0DZrST6GMEFIZUdcsVz0MQgm7Pu7aMf4s46AiQySUKpUB24o1pMOlSJE3G1pYmbL4cW78k/TdfxNKO5dQ0L4YuYgcKo8AO2NSE6Q3tS2jj2iMzlRWZVvNzkyTUZp3ynGwZPtTdqYUOzAHi/de5XMvc5LhVAiMHAsGAPqVgz+jg4a+6A+S2XhJUMG9sAuqQUxfF0dUwu+4T0tgJ2Vkg2YQ2IBvM1d0EevNNkYUL6p1MPgakVNb340CUAOrNdRHuq6zTVjKkftKXW32tfPwQs/GoLIAsbXunFDz1xIh+Px8TKECD0udKBAmEI8k6sVnQAhfwYLCgEjCyMjXsWdHCfJ3VKQOPeX5kr6OH+cd6NRSTYeWIpbgLSKQsAz76xqRfaWQlPDSpxaHFXrBw0qR24Y+SYLhf2ToPyFPkKCxuArGdzRW0fmsTD2e8qlqvVDVMlL9NvxxLHHLpvRxOm/MIaAPXSklAUAs+Qviu68EBYq71j8iDAEnX6/SnyHaF/yCViewKYUHtsQay40419xHVjbtyRorTUP5wWqcx6s9/X2qAAHcMHecntqu59koVjLCfePZ/ad5MHUBwYRc5AJ1y8cHPOA94XHDT8eic3j++Utm1gXtly+DOtiJfGqw7an34ibcn2OzvoHGopBJvmQRrFiBTsRPXHBlF5s4JXbAWZZvfLzQ0kgrOg2SoOWu+i6C6xH9HzNM0eA19SpWlaKeAVixf/cEUdg8jDUmzD262NQaC32PlZIQ3Hpd35pK6t0ukX4E4MA42fd2q4WBoFz51L+ozP2rrgMis4rkT70k320ih7ZwauG3tgNBSE0WnBiAFC5KNpA7aCGjP6SlFmpCNlI22u3n0XP9ulL7Nk24XHgpEyDAu4rBl1kZfqIXP9913+pe107ndOov8V7GbC+jEgLTSuyjB/bnKxo9tnO54ycT866SmQR4gd2nOPixcy2vG2Gu5p8iY04h/YkXdpYmmPvXEVkluIFgyAW2qL8iXBWANYqoJ29/LbBgpBh+dWt9YS0HDfL01ixf2gS5ijTQFjqvBbB7Dj7xOuiV6qIlFwHF6t+r0zgZuflOWIGaWLgjAG43sLzFVVSRLgcrJjfQbB4tuoNoSM8vS68s3gay8fBASo+mZFebqmJ/hXaTnoownUZQdyj2f+VQint+9hL7hlaieSUh04fHQNr8jKoJsKjcKtBbNWNohMvjiii2FqEABq7E4P3Je+l9BhYrtPKbR+NDhINmRUyoC4VoIIE9NVh6216jetnRbreBosvVFpsmahJ18ZoTjAPyPiif5IeoAKAMcmtRhMDM9vHNuRT9fzi3fJSvCywCUMXByVOR+b/HDk3G05SfqNCJLE/BMepkWYhYZ0uO2RmWFDmh1McfD99DZgPBo88zb6KhqOuoMj6tTrikkK8HJZodPvDd1vCmnRR5SCotITJsyoZ99b+2P+zU7qaUd3QYBB3RYhyt2FrTgbjIHlbd/Zu8fceb/25e/+rDCdXJ7oUIOCswLX2av8S+hJ/M+2Zm7FJKlvGS3x+CQkieztl/rTecJqiOXBUCDtFC7IkwDt0J2xLyQcWgeurfrNBthlVKOo6GhR/4kdgVEjRu529xz0Gd55r+yWxN1IRIIgfEFcOx3fSsc14DC+5N3xgH5jwzNGNfttbDRN8VCN/rHuA0ZfiNcQYaDi9/p3ct9UpCxnUgAPnaAldy2Xw3VxFR4lyvTln5CjjmGNBR9ENxW6N2neixGz0SuOlbE0u8X3rxBcPQf9DvzHmkGNf/lDl92Lf+m0HhkA6uUG8kI2icKggaYfQQQOg/qNIA/UaNQhBcwSXDTX9kKGnAg4IoFVo9yPf/EXkCXwNdwBZvwPtK/tOLLoEY53EqwJA16nt7G0I9qxhKyrl7ehpaWBlTdGK9FZYyipEAg0nkUMSQbxWd1iFToisH7cdNE6N9r83Wcvz10e+BMuWYkWk4EgTohCYDMByF4W1DvQk07j6Tdr3Vid44BnRey6KjTk9UAOsBqYusJAEDYgAqnJE48c+H0qI8/mYkIYLlA01mn2ZbFA4fJbeNFBOx33q5yABDICXKQkGQMOlWxnUJGX3bPrYVqPnXqpQMZleV1w1fAWy7+v64c2i1bUvw+HJy7KdhHZ5jdhj3+HcVESuOT5OP5R/FsQvyE3GJe1+KLpp7BvJTwJ9uYugQAUE4KmCzZ04nV3r/jQlCy2pq5S8FsgPbru8w7k8nQGjBUY7PpY8hrLmBJsuIOpNi9muzWYqT1dNjQrbXtLYFyBTy1p0KJck1GCManfpEovzDSq1r/2KfjRVnHskanjdPXwr2rosKh7jxAo+sc++/9y/N9A/6kDXWphhL8DDfImwjvlf1UAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1u1IhUHK4g6ZKhOFsSKOGoVilAh1AqtOphc+gVNGpIUF0fBteDgx2LVwcVZVwdXQRD8AHFzc1J0kRL/lxRaxHhw3I939x537wB/vcxUs2MCUDXLSCXiQia7KgRfEcQwBhBDl8RMfU4Uk/AcX/fw8fUuyrO8z/05epWcyQCfQDzLdMMi3iCe3rR0zvvEYVaUFOJz4nGDLkj8yHXZ5TfOBYf9PDNspFPzxGFiodDGchuzoqESTxFHFFWjfH/GZYXzFme1XGXNe/IXhnLayjLXaY4ggUUsQYQAGVWUUIaFKK0aKSZStB/38A85fpFcMrlKYORYQAUqJMcP/ge/uzXzsUk3KRQHOl9s+2MUCO4CjZptfx/bduMECDwDV1rLX6kDM5+k11pa5Ajo2wYurluavAdc7gCDT7pkSI4UoOnP54H3M/qmLNB/C/Ssub0193H6AKSpq+QNcHAIjBUoe93j3d3tvf17ptnfD4Tqcq5Pkf9OAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QcbFTkTL7KB4AAADgpJREFUeNrt3V9sW9UBx/HfubZjX7s4sb24pGm3htZ7WBgg2qV9AK2ZxCSg2sP+ECH+SN3TJMo0aWhsDwPepkmbNAmm7QmkbnsIYnvYCps0aSkSD1ANxkYjTWshpRTaJWqaFBwnaZKzh0tHaJqmSe3j6+PvR5pWJDbIPf7ec+659zrGWisA7SXgEACED4DwARA+AMIHQPgACB8A4QMgfACED4DwARA+AMIHQPgACB8A4QMgfACEDxA+AMIHQPgACB8A4QMgfACED4DwARA+AMIHQPgACB8A4QMgfACED4DwARA+QPgACB8A4QMgfACED4DwARA+AMIHQPgACB8A4QMgfACED4DwARA+AMIHQPgA4QMgfACED4DwARA+AMIHQPgACB8A4QMgfACED4DwARA+AMIHQPgACB8A4QOED4DwAfgu2Wr/wtMXrd44Lzs+J43PSTML0sSsVF2UPlqM/nq5bFLalJByiejP3RmpnJb6stGf+3LGtNLPf/wHo1aSgkygIEwoESYUhAmlCiklCymlt2SUKnQovSXTUj/XI989b+P87xeGRtnQKPz4P8VioFIp0NbepEpFo61bk4bw6+jYtLVHJ6WTVWlsZmXYa5lZuOx/c+Hyv8Pa/ry0PSfdnJcGSq1xIliaXdLS7JIWzl+UJNVW/i023JFTuiejcEdWm/rzLfXBjJtazapWu+q5yVZ2JtXbm9DnKyndeksq1sfbWBu/E+3hM9YePSeNXmjOP78/Lw2WpdsLxnSm4jnjb2jW2pFTflen8rsLsftQxn3G34jKzqT27unQ3j1pQ/gxjX2tk8BgOR4rgesJP84nAR/Dj/NJoOnhD5+y9vDZ9S/hXetOS/2d0sOfa+4qoF7hX5IqpBTelNPmoV5D+I1XLAaq7Ezq4Qdzpu3Cn56XDr1r7ZGJ1hy8feXmnQDqHf5y+V1dTTsBtEv4y+0Z6GjaCcB5+E8fb93g43ACaGT4zTwBtGP4zTwBOAu/VZb065VLSvtvlO77rJs9ABfhS1IQJtR1R0mlu7oN4TdeGBp95csZ3XOPm9uwDQ//2LS1z5yQJub8HrjutPToTqP+Thkfwl++B7B5qFfhTY2dkdo9/OV7AA8/kFOl0tjnAhr65N6z71j75Kj/0UvRz/jEqNWzY9arD/DF8xd1+tcnNfHHs4TpwOTkkn7x9Id64fcztuXCn56XvvO6tS+ebb+Be/FM9LNPX/Tr55p65ZxO/uQ/xO/IyMtz+vFT07Zlwh8Zt/bgm9a2wyx/tdn/0X9Ye/iMf7P/20/+2069co4TgKPZ/7HHp+zIkVkb6/CHT0XX875t4G1EdUF6bkx6/pRf8S/VFjXxx7M699cJ4negVrN64Q81vfRSfeOvW/jPHLf2+dMM1IqT4eno2Hg3G/11XP8dfp/4XV1C/qWm3/y2amMV/vfftHZkgsFZ9fJnQnrsTf/iv/D6lE794m3id+TVo/P6yU8v2FiE//03rT05w6CsZWzGz/jnPpglfodOv79Yl/gDoid+4m+/+AOiJ37ib7/4NxT+M8eJ/nrj93HDb+6DWTb8HMe/0Q2/dYc/fIqNvHoYmfDvVp8Ubfhxq8+dV4/Ob+hW37rCP/wBt+zqafi0NDIuL2/1ffj3KeJ35MW/1PTqa/O2IeFPz0cfVNTXcyetfHu8V5LG/3SWwXXohT+s79r7msN//C1reSKv/qoL0uP/8m/Jv1Rb5Nl+h2o1u65n+68p/Gffae9n7xttYk7evdUnRc/281afw0usyaVrfqtvzfCPTbfnW3bOr9POSKPT/l3vT71yTrV3qsTvyMjLczp+fMFed/jPnOBguvL0CT/7+O/w+wyuQ4d+V72+GX/4FEt810v+59/zc8nPLT63S/6X/nz1W3yrhj89Lx1mie/c4TN+/lxTr5xjcB3625HZjc34h95lF78ZqgvS0yf83OXnqT53ajWrQ1d5qi9YbbY/wtN5TXNkXF7e27/w+hSD69BrR+fXN+MfetdyZm4yX8eAWd/x52iVWT9gto/vrO8jZv14zPoBs318+bjDL4kdfseutMO/Ivy4/bbadsYOP+rhSjv8nwp/ZJz79nFSXYh+fbhvP9dSbVF8Rbc7tZrV5V/RfVn4HKS4Oerp5PjR6IcMrkP//NfFK8/40/Ms8+PI1zGpvV1lcB06fmLhyuG/McWmXnyv9f0cG5b7bi1f7gcs81nus9xvv+V+4PuSkuU+y32sXO4H0YzCMj/28Xv4rr4k3tV3Hf/H7+oHknSM2T7+y/1JP/v46BjLfafL/bfmP5nxT7Liir0xT8do7swsg+vQ6dOLn4TP9X38+foLTOY+IHyn4b//cfhjVXGN1QKqC36+qrtUW2RwHarVotyDiVm6bxVvnPdzE/YCv3zDqVdfm7PBGL8Dr2WMe/oexcXz8wyuQ+cmlxSM81IO4TfZwvmLDK7r8CfYW2kZM55eDi/OLjG4jq/zgypfqNkyfD1JL0yy1Hdp8tySghk2VVuGrydpdvabMON/xDFvnfBZ6qMel4w1q4DvzmfGZ8ZvwxmfwwC0H8IHCB9AW4SfTXIQWkXO07EKwgSD61AYGgWbOOatE76nY5XIsPB0KRsaBVnCZ8Znxm+/Gb87w4FomTM14aMe4WeNghzX+C2jO+3nz5UqpBhch4rFQEE5zYFoFb6OVZLwnSoRfmvpyxkvf670lpDBdWhbb1LB7QVjOBQtMuN7uh+TKjLjO13qlwIFnSl/N418sz0rL0/S6Z4Mk49DW3sTJpCkviwHI+76O/38ucIdOQbXoUolmuUDSdrOsY//9b2nJ+d0D/eTHc/2n4Q/UGSlFf8Z388xYsZ36/M7U5+Ef3OnKD/mBop+jtGm/hv47Dl0yy0p8//wJak/z0Hh+p7Zvh2u7z8V/kCJAxNXg91+Tor5XV0MrkN7B9Irw9/fw/18lvnOw+cz5/Jz9KUOsyJ8lvvxXeb7+D5FuCMndpbcLvODZbV/KnyW+yzzWeb7v8xfEf7+HmN4ii8+ymlpsOzfvJgqdCi/m2W+K6VioL17Osyq4Ufxc6DitMz3UbiDR0VdL/MvtyL8oW1s8sXFge1+jsXmb/XyGXPogftXvtYZXPm6koPV9Gv7sp+bevndXWzquby239PxqU29q4Z/oI9Zn9me2d7X2X7V8HNJZn1me2Z7X2f7VcOXpIMVdvibIZf0c7YPMglme4eyoVl1tr9q+BI7/M2wv8d4OdsX7iwx27tcNe7LrDrbrxn+0DZj+E4+d8pp6b5tft63L97VTfaOlIqB7rn76t9qtOavMHlkJ+PlysGKn8d689AWBtehhx5c+63HNcO/uVOGJb+bJX5/3r/ZvnBHSeFNOWYPZ0v8tCo7k+a6w5ei23ss+Ru7xD/Q5+cS/zNfu5HoHS7xv/n17DUd72v+bYU/u5Vd/kbIJaNj69vPFWQS2v7DCtE7kg2Nnnri2r+fLVjPB/Tb2xnHehva5ucufumrZXbxHbrn7vCqu/gbDl+K3hS7bxujWc/o7+3xL4/SXWV13cE3uLpy792hBvel13W8g/V/WGV4qu/6DXYbL2/d5Xd1cevOob17Ota8dVeX8KXoqb7tvFm5YX1Z6WDFv+jTW0JtHuLpPFe29ib00AMbu2MSbPQf+vPbiH+j0f/sNuNl9J/93k1E7zD6Hz2e3/DxDq7nH078RE/0rRf9dYdP/ERP9K0XfV3CvxQ/G36rG+w2Xkaf39VF9A7t3dNRl+glqW53kA9WjOnOyD7/nmWElhna5ufufemuMrv3Dt17d7ih3fuGhx99yGVyCWOHT1vNLLT3QH38Xr1335IbZBIqf+1G3cC35DqRDY2+8fXsim/JjVX4krR/i8xg2eixf1o7Pteeg1VOR4/h+vZEXqrQET2GS/JuVlXFQE890WmCoP7/3w35aOaS0q92GfPcmLWHz7TXYO3vMV6+cFO4o8QLNw4N7ktf8ws3sQn/kgN9xnypKPvLE1a+z/7ldPQ+vW+v1qYKHdo8tIVXax3O8g89mLumV2tjG74Uvc//q11Gw+/JHj7j37V/LhnN8r5t4AWZhAp3ltjAc3gtP7gvU9cNvKaGf8nQNpn9PUbPjVk7MuHJcqwsHdzp4W263V3afB+P3rqyd0/Hhh+9jX34l2bHgxVjDvSppU8Ag+Xom3B927zL7+6KvgmX5J0F/8D9uYZs3sUq/NVOAKMXFPs9AJb0aMUlfazCv/wEIEkj47IjE1aj0/EaqP5OaaBotN+z9+bDHTnlvnCDCneWCN6BSiWpW7+Y0uC+TCyOd2wWq4Pl6P5/dUE6OtnckwCxw8fYYxn+8lXApZOAFJ0ERqetxmbUkBNBLiltz0Uv0QyU/LkdF2QSSvdmlN6S0ab+G7gd52AJ37s1oa29Cd16S0fDb8d5F/7lBooyA8u+xWmsKjsxJ41Vo2cDJuak6oI0syBVF6M/Xx52LiFlk1J3Ovrrcloqp41uL8h0plo37CAMlAgTShZS///vVCGl/K4CG3QNCDvMGoWhUbEYKAyNSsVApVKg3benTbLFNnqNtbxUA7SbgEMAED4AwgdA+AAIHwDhAyB8AIQPgPABED4AwgdA+AAIHwDhAyB8AIQPgPABED5A+AAIHwDhAyB8AIQPgPABED4AwgdA+AAIHwDhAyB8AIQPgPABED4AwgdA+ADhAyB8AIQPgPABED4AwgdA+AAIHwDhAyB8AIQPgPABED4AwgdA+AAIHwDhA4QPgPABED4AwgdA+AAIHwDhAyB8AIQPgPABED4AwgdA+AAIHwDhAyB8AIQPED4AwgdA+AAIH0Dr+x+denIhfdML2gAAAABJRU5ErkJggg==')",
}));

export const ActionsContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexGrow: 1,
  maxWidth: '100%',
  justifySelf: 'stretch',
  [theme.breakpoints.up(maxContentWidth + maxSidebarWidth)]: {
    width: `${maxContentWidth}px`,
  },
}));

export const SectionDesktop = styled(Grid)(({ theme }) => ({
  justifyContent: 'flex-end',
  alignItems: 'center',
  color: theme.palette.texts.hint,
  [theme.breakpoints.up('md')]: { display: 'flex' },
}));

export const UserAvatar = styled(UserIcon)(() => ({
  width: '22px',
  height: '22px',
  borderRadius: '50%',
}));

export const UserName = styled('p')(({ theme }) => ({
  fontSize: '15px',
  color: theme.palette.text.primary,
  margin: theme.spacing(0, 1),
}));

export const CaptionsTypographyWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(0.75, 2),
}));
