interface props{    
    widthLogo:number,
    heightLogo:number 
}

const LogoFlash: React.FC<props> = ({widthLogo,heightLogo}) => {
    return (  
        <div className="flex justify-center align-middle relative w-full h-full">      
            <div className="flex-col gap-4 w-full flex items-center justify-center animate-spin">
                <div className="w-36 h-36 border-8 text-blue-400 text-4xl  border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full ">

                </div>
                </div>          
                    <svg
                className="animate-pulse absolute perfect"
                xmlns="http://www.w3.org/2000/svg"
                width={`${widthLogo}px`}
                height={`${heightLogo}px`}
                fill="currentColor"
                viewBox="0 0 29 29"
                >
                <path
                    d="M0.46002 3.93805V18.7814C0.46002 18.7814 6.30321 23.4884 12.8525 21.8085C15.3034 21.1836 17.6569 19.0411 18.1763 15.9085C18.3791 14.6749 17.9653 14.0744 17.5676 13.9364C17.0725 13.766 16.4558 14.3828 16.1068 14.7723C15.1816 15.8111 14.8489 16.3792 13.8994 16.9797C11.7569 18.3431 10.5476 17.1826 9.99579 16.6227C8.77034 15.3729 8.63238 12.4026 10.5801 9.41605C12.5278 6.42952 17.5919 3.83255 24.4658 6.00752C27.8743 7.08689 28.9456 8.27175 28.9456 8.27175L28.9212 2.02278C28.9212 1.18688 28.2152 0.513293 27.3306 0.4646H2.04255C1.15796 0.513293 0.451904 1.18688 0.451904 2.02278L0.46002 3.93805Z"
                    fill="#52B09F"
                ></path>
                <path
                    d="M28.9536 25.3872V10.552C28.9536 10.552 23.1104 5.845 16.5611 7.52491C14.1103 8.14981 11.7567 10.2923 11.2373 13.4249C11.0345 14.6585 11.4484 15.259 11.846 15.397C12.3411 15.5674 12.9578 14.9506 13.3068 14.5611C14.232 13.5223 14.5647 12.9542 15.5142 12.3537C17.6567 10.9903 18.866 12.1508 19.4178 12.7107C20.6433 13.9605 20.7812 16.9308 18.8335 19.9174C16.8858 22.9039 11.8217 25.5008 4.9478 23.3259C1.53927 22.2465 0.468018 21.0616 0.468018 21.0616L0.492364 27.3106C0.492364 28.1465 1.19842 28.8201 2.08301 28.8688H27.3711C28.2556 28.8201 28.9617 28.1465 28.9617 27.3106L28.9536 25.3872Z"
                    fill="#005492"
                ></path>
                </svg>
            </div>
            
    );    
};

export default LogoFlash;