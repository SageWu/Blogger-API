/**
 * @file ip服务
 * @module core/helper/ip/service
 */

import { Injectable } from "@nestjs/common";
import * as geoip from "geoip-lite"
import Axios, { AxiosResponse } from "axios";

export interface IpInfo {
    ip?: string;
    country?: string;
    city?: string;
}

@Injectable()
export class IpService {
    //通过淘宝ip库查询
    private queryByTaobao(ip: string): Promise<any> {
        return Axios.get(`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`).then(
            (response: AxiosResponse<any>) => {
                if(response.data && response.data.code === 0) {
                    return response.data.data;
                }
                else {
                    return Promise.reject(response.data);
                }
            }
        );
    }

    //通过GEO查询
    private queryByGeo(ip: string) {
        return geoip.lookup(ip);
    }

    //查询ip地址相关信息
    public query(ip: string): Promise<IpInfo> {
        return this.queryByTaobao(ip).then(
            (value) => {
                let ip_info:IpInfo = {};
                ip_info.ip = ip;
                ip_info.country = value.country;
                ip_info.city = value.city;

                return ip_info;
            }
        )
        .catch(
            (error) => {
                let result = this.queryByGeo(ip);
                let ip_info: IpInfo = {};
                ip_info.ip = ip;
                ip_info.country = result.country;
                ip_info.city = result.city;
                
                return ip_info;
            }
        );
    }
}