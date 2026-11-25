
import React, { ReactNode } from "react";
import styles from "./styles/custom-filter.module.css";

interface CustomFilterProps {
    children: ReactNode;
    className?: string;
}

const CustomFilter: React.FC<CustomFilterProps> = ({
    children,
    className = ""
}) => {
    return (
        <div className={`${styles.filterContainer} ${className}`}>
            {React.Children.map(children, (child) => (
                <div className={styles.filterItem}>
                    {child}
                </div>
            ))}
        </div>
    );
};

export default CustomFilter;
